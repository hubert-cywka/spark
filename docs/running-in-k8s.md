# Deployment
## Prerequisites
I personally use `chocolatey` package manager, so every step below assumes you use it as well.

### Minikube
Installation: `choco install minikube`.
Verification: `minikube --help`.

### Terraform
Installation: `choco install terraform`.
Verification: `terraform -help`.

### Kubectl
Installation: `choco install kubernetes-cli`.
Verification: `kubectl version --client`.

### k9s
Installation: `choco install k9s`.
Verification: `k9s --help`.

## Step-by-step guide
1. Run `minikube start`.
2. Verify if cluster is running with `kubectl cluster-info`.
3. Go to [terraform directory](../infrastructure/terraform).
4. Run `terraform init` -> `terraform plan` -> `terraform apply --auto-approve`.

// TODO: Add a powershell script that will also enable port forwarding.
