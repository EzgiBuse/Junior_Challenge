import { DataSource } from 'typeorm';
export default class TransactionalTestContext {
    private readonly connection;
    private queryRunner;
    private originQueryRunnerFunction;
    constructor(connection: DataSource);
    start(): Promise<void>;
    finish(): Promise<void>;
    private buildWrappedQueryRunner;
    private monkeyPatchQueryRunnerCreation;
    private restoreQueryRunnerCreation;
    private cleanUpResources;
}
