import * as fs from "fs";
import { PluginInstance } from "../PluginInstance";

export async function writeEnv(postgresInstance: PluginInstance) {
	const path = `${postgresInstance.getInstallationPath()}/.env`;
	let env = "";
	const keys: any = await postgresInstance.getContainerController().getEnv();
	Object.keys(keys).forEach((key) => {
		env += `${key}="${keys[key]}"
`;
	});

	fs.writeFileSync(path, env);
}