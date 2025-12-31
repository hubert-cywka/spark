#!/bin/bash

trap finish EXIT

# --- Common configuration ---
BUCKET_NAME="spark"
REGION="garage"

# --- Kubernetes configuration ---

#MODE="k8s"
#EXEC_CMD="kubectl exec -n $NAMESPACE"
#NAMESPACE=""
#REPLICAS=1

# --- Docker configuration ---

MODE="docker"
EXEC_CMD="docker exec"
REPLICAS=1
SERVICE_NAME="docker-s3"


run_on_node0() {
    if [ "$MODE" == "k8s" ]; then
        $EXEC_CMD garage-0 -- garage "$@"
    else
        MSYS_NO_PATHCONV=1 $EXEC_CMD ${SERVICE_NAME}-1 /garage "$@"
    fi
}

echo "1. Configuring cluster."
NODE0_ID=$(run_on_node0 status | grep -i "node id" | awk '{print $3}' || run_on_node0 status | grep -E "^[0-9a-f]" | head -n 1 | awk '{print $1}')

for i in $(seq 1 $(($REPLICAS - 1))); do
    if [ "$MODE" == "k8s" ]; then
        TARGET_ADDR="garage-$i.garage.$NAMESPACE.svc.cluster.local:3901"
    else
        TARGET_ADDR="${SERVICE_NAME}-$((i+1)):3901"
    fi
    
    run_on_node0 node connect $(run_on_node0 -id -node $TARGET_ADDR)
done

echo "2. Configuring layout."
NODE_IDS=$(run_on_node0 status | grep -E "^[0-9a-f]" | awk '{print $1}')

for ID in $NODE_IDS; do
    echo "Assigning role to node $ID."
    run_on_node0 layout assign "$ID" --zone "$REGION" --capacity 100
done

echo "3. Applying configuration."
CURRENT_VERSION=$(run_on_node0 layout show | grep "Version" | awk '{print $2}')
NEXT_VERSION=$((CURRENT_VERSION + 1))
run_on_node0 layout apply --version $NEXT_VERSION

echo "4. Creating API key."
KEY_OUTPUT=$(run_on_node0 key create admin)
KEY_ID=$(echo "$KEY_OUTPUT" | grep "Key ID:" | awk '{print $3}')
SECRET_KEY=$(echo "$KEY_OUTPUT" | grep "Secret key:" | awk '{print $3}' | tr -d '\r')

echo "5. Creating bucket: $BUCKET_NAME."
run_on_node0 bucket create "$BUCKET_NAME"
run_on_node0 bucket allow --read --write --owner "$BUCKET_NAME" --key "$KEY_ID"

echo "Garage initialized."
echo "--------------------------------------"
echo "S3 ACCESS KEY ID:     $KEY_ID"
echo "S3 SECRET ACCESS KEY: $SECRET_KEY"
echo "--------------------------------------"

echo "Press [Enter], to exit..."
read