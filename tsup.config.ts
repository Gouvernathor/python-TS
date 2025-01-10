import {defineConfig} from 'tsup';

export default defineConfig({
    entry: ["python.ts", "python/**/*.ts"],
    format: "esm",

    dts: true,

    sourcemap: true,
    clean: true,
});
