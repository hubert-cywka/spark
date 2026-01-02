import { InboxAndOutbox1749299050551 } from "@/common/events/migrations/1749299050551-inbox-and-outbox";
import { InboxAndOutboxSequenceNumber1753291628862 } from "@/common/events/migrations/1753291628862-inbox-and-outbox-sequence-number";
import { InboxAndOutboxSplitTopicAndSubject1753291628863 } from "@/common/events/migrations/1753291628863-inbox-and-outbox-split-topic-and-subject";
import { ImproveInboxOutboxIndexes1767377704017 } from "@/common/events/migrations/1767377704017-improve-inbox-outbox-indexes";

export const getIntegrationEventsMigrations = () => [
    InboxAndOutbox1749299050551,
    InboxAndOutboxSequenceNumber1753291628862,
    InboxAndOutboxSplitTopicAndSubject1753291628863,
    ImproveInboxOutboxIndexes1767377704017,
];
