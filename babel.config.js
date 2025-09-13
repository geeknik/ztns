module.exports = {
presets: [
    ['@babel/preset-env', {
    targets: {
        node: 'current',
        browsers: ['last 2 versions']
    },
    modules: 'auto',
    useBuiltIns: 'usage',
    corejs: 3
    }]
],
plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime'
]
}
