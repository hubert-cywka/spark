import "server-only";

import { Card } from "@/components/Card";
import { AreaChart, BarChart, PieChart } from "@/components/Chart";
import { Container } from "@/components/Container";
import { onlyAsAuthenticated } from "@/features/auth/hoc/withAuthorization";
import { withSessionRestore } from "@/features/auth/hoc/withSessionRestore";

const data = [
    { key: "2025-01-01", value: 5 },
    { key: "2025-01-02", value: 8 },
    { key: "2025-01-03", value: 14 },
    { key: "2025-01-04", value: 20 },
    { key: "2025-01-07", value: 23 },
    { key: "2025-01-08", value: 25 },
    { key: "2025-01-11", value: 29 },
    { key: "2025-01-12", value: 30 },
    { key: "2025-01-13", value: 34 },
    { key: "2025-01-14", value: 37 },
    { key: "2025-01-17", value: 40 },
    { key: "2025-01-18", value: 42 },
    { key: "2025-01-21", value: 45 },
    { key: "2025-01-22", value: 46 },
    { key: "2025-01-23", value: 48 },
    { key: "2025-01-24", value: 51 },
    { key: "2025-01-27", value: 53 },
    { key: "2025-01-28", value: 57 },
];

const entryLoggingData = [
    { key: "Mon 0-2", value: 5 },
    { key: "Mon 2-4", value: 8 },
    { key: "Mon 4-6", value: 14 },
    { key: "Mon 8-10", value: 20 },
    { key: "Mon 10-12", value: 23 },
    { key: "Mon 12-14", value: 5 },
    { key: "Mon 14-16", value: 8 },
    { key: "Mon 16-18", value: 14 },
    { key: "Mon 18-20", value: 20 },
    { key: "Mon 20-22", value: 23 },
    { key: "Mon 22-24", value: 23 },
    { key: "Tue 0-2", value: 5 },
    { key: "Tue 2-4", value: 8 },
    { key: "Tue 4-6", value: 14 },
    { key: "Tue 8-10", value: 20 },
    { key: "Tue 10-12", value: 23 },
    { key: "Tue 12-14", value: 5 },
    { key: "Tue 14-16", value: 8 },
    { key: "Tue 16-18", value: 14 },
    { key: "Tue 18-20", value: 20 },
    { key: "Tue 20-22", value: 23 },
    { key: "Tue 22-24", value: 23 },
    { key: "Wed 0-2", value: 5 },
    { key: "Wed 2-4", value: 8 },
    { key: "Wed 4-6", value: 14 },
    { key: "Wed 8-10", value: 20 },
    { key: "Wed 10-12", value: 23 },
    { key: "Wed 12-14", value: 5 },
    { key: "Wed 14-16", value: 8 },
    { key: "Wed 16-18", value: 14 },
    { key: "Wed 18-20", value: 20 },
    { key: "Wed 20-22", value: 23 },
    { key: "Wed 22-24", value: 23 },
    { key: "Thu 0-2", value: 5 },
    { key: "Thu 2-4", value: 8 },
    { key: "Thu 4-6", value: 14 },
    { key: "Thu 8-10", value: 20 },
    { key: "Thu 10-12", value: 23 },
    { key: "Thu 12-14", value: 5 },
    { key: "Thu 14-16", value: 8 },
    { key: "Thu 16-18", value: 14 },
    { key: "Thu 18-20", value: 20 },
    { key: "Thu 20-22", value: 23 },
    { key: "Thu 22-24", value: 23 },
    { key: "Fri 0-2", value: 5 },
    { key: "Fri 2-4", value: 8 },
    { key: "Fri 4-6", value: 14 },
    { key: "Fri 8-10", value: 20 },
    { key: "Fri 10-12", value: 23 },
    { key: "Fri 12-14", value: 5 },
    { key: "Fri 14-16", value: 8 },
    { key: "Fri 16-18", value: 14 },
    { key: "Fri 18-20", value: 20 },
    { key: "Fri 20-22", value: 23 },
    { key: "Fri 22-24", value: 23 },
    { key: "Sat 0-2", value: 5 },
    { key: "Sat 2-4", value: 8 },
    { key: "Sat 4-6", value: 14 },
    { key: "Sat 8-10", value: 20 },
    { key: "Sat 10-12", value: 23 },
    { key: "Sat 12-14", value: 5 },
    { key: "Sat 14-16", value: 8 },
    { key: "Sat 16-18", value: 14 },
    { key: "Sat 18-20", value: 20 },
    { key: "Sat 20-22", value: 23 },
    { key: "Sat 22-24", value: 23 },
    { key: "Sun 0-2", value: 5 },
    { key: "Sun 2-4", value: 8 },
    { key: "Sun 4-6", value: 14 },
    { key: "Sun 8-10", value: 20 },
    { key: "Sun 10-12", value: 23 },
    { key: "Sun 12-14", value: 5 },
    { key: "Sun 14-16", value: 8 },
    { key: "Sun 16-18", value: 14 },
    { key: "Sun 18-20", value: 20 },
    { key: "Sun 20-22", value: 23 },
    { key: "Sun 22-24", value: 23 },
];

function Page() {
    return (
        <Container>
            <div
                style={{
                    flexGrow: 1,
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gridTemplateRows: "repeat(1, 1fr)",
                    gridGap: 10,
                }}
            >
                <Card>
                    <h3>Mean entries per day</h3>
                </Card>
                <Card>
                    <h3>Total entries per day</h3>
                </Card>
                <Card>
                    <h3>Longest streak</h3>
                </Card>
            </div>

            <div style={{ marginBlock: 10 }} />

            <Card>
                <AreaChart data={data} keyLabel="Entries" title="Accumulated number of entries" />
            </Card>

            <div style={{ marginBlock: 10 }} />

            <div style={{ display: "flex", gap: 10 }}>
                <Card style={{ flexGrow: 1 }}>
                    <PieChart
                        title="Activity by days"
                        data={[
                            { key: "Mon", value: 20 },
                            { key: "Tue", value: 25 },
                            { key: "Wed", value: 23 },
                            { key: "Thu", value: 15 },
                            { key: "Fri", value: 10 },
                            { key: "Sat", value: 4 },
                            { key: "Sun", value: 2 },
                        ]}
                    />
                </Card>

                <Card style={{ flexGrow: 2 }}>
                    <BarChart data={data} keyLabel="Entries" title="Times of entry logging" />
                </Card>
            </div>

            <div style={{ marginBlock: 10 }} />

            <Card style={{ flexGrow: 1 }}>
                <BarChart data={entryLoggingData} keyLabel="Entries" title="Times of entry logging" />
            </Card>
        </Container>
    );
}

export default withSessionRestore(onlyAsAuthenticated(Page));
