import ConfigJSONDataDev from "./config.dev.json" assert { type: "json" };
import ConfigJSONDataProd from "./config.prod.json" assert { type: "json" };

interface Config {
    firebase: {
        projectId: string;
        host: string;
        port: number;
    };
}

class Configuration {
    public isDevelopment = process.env.NODE_ENV === "DEV";
    public isProduction = process.env.NODE_ENV === "PROD";
    public config: Config;

    constructor() {
        this.config = this.getConfig();
    }

    private getConfig(): Config {
        if (this.isDevelopment) {
            return ConfigJSONDataDev;
        } else if (this.isProduction) {
            return ConfigJSONDataProd;
        } else {
            throw new Error("Unknown environment");
        }
    }
}

export default new Configuration();
