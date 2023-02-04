module.exports = {
    presets: [
        [
            '@vue/app',
            {
                useBuiltIns: 'entry'
            }
        ]
    ],
    plugins: [
        [
            'babel-plugin-component',
            {
                libraryName: 'element-ui',
                styleLibraryName: '~node_modules/element-theme-chalk/src',
                ext: '.scss'
            }
        ]
    ]
}
