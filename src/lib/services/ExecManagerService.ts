//Unused yet - double check
export class ExecManagerService {

    // This might become unweildy when used extensively.
    // This is use to simply lock the data generation for N
    // minutes to avoid regenerating the same chart data when the same request is received.
    // We can totally avoid using this in a normal high end server however this helps improve the perfomance when used.
    // properly.
    //
    // Note that chart data are cached by default however once the data has expired, it has to be regenerated.
    // This is the point this flag will kick in to enable single operation for the same data set to run.
    // User might experience network error under the hood for a short time while generating
    // but a simple refresh would help mitigate this.
    static setDataGenExecFlag(type: ChartType, range: string, status: ChartDataGenStatus): void {
        const cacheKey = CacheKeys.ChartDataGenExecFlagPrefix.key + type + ':' + range;
        const ttl = CacheKeys.ChartDataGenExecFlagPrefix.ttl;
        Caching.set(cacheKey, status === ChartDataGenStatus.active? 1 : 0, ttl);
    }
    
    static async getDataGenExecFlag(type: ChartType, range: string): Promise<ChartDataGenStatus> {
        const cacheKey = CacheKeys.ChartDataGenExecFlagPrefix.key + type + ':' + range;
        const ttl = CacheKeys.ChartDataGenExecFlagPrefix.ttl;
        const v = await Caching.get(cacheKey);
        return v === 1? ChartDataGenStatus.active: ChartDataGenStatus.inactive;
    }
}