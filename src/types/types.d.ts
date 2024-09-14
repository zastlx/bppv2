declare module "~plugins" {
    const plugins: iPlugin[];
    export default () => plugins;
};