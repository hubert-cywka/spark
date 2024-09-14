export async function healthCheckGraphs(graphs: string[]): Promise<boolean> {
    const promises = graphs.map(checkGraphStatus);
    const result = await Promise.all(promises);
    return result.every((res) => !!res);
}

async function checkGraphStatus(url: string): Promise<boolean> {
    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ query: "{ __typename }" }),
    });

    if (response.ok) {
        const result = await response.json();
        return !!result.data;
    } else {
        return false;
    }
}
