const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const srcPath = path.resolve(__dirname, 'src');
const { NetlifyPlugin } = require('netlify-webpack-plugin');

const devServer = (isDev) =>
    !isDev
        ? {}
        : {
              devServer: {
                  open: true,
                  port: 8080,
                  hot: true,
                  historyApiFallback: true,
                  static: {
                      directory: srcPath,
                      watch: true,
                  },
              },
          };

module.exports = ({ development }) => ({
    mode: development ? 'development' : 'production',
    devtool: development ? 'inline-source-map' : false,
    entry: {
        main: './index.ts',
    },
    context: path.resolve(__dirname, 'src'),
    output: {
        publicPath: '/',
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: '[file]',
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(html)$/,
                include: path.join(__dirname, 'src/components'),
                use: {
                    loader: 'html-loader',
                },
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg|webp)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(?:mp3|wav|ogg|mp4)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    experiments: {
        topLevelAwait: true,
    },
    optimization: {
        minimize: true,
    },
    plugins: [
        new NetlifyPlugin({
            redirects: [
                {
                    from: '/*',
                    to: '/index.html',
                    status: 200,
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css',
            chunkFilename: '[name].[chunkhash].js',
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: path.resolve(__dirname, './src'),
                    globOptions: {
                        ignore: ['**/*.js', '**/*.ts', '**/*.scss', '**/*.sass', '**/*.html'],
                    },
                    noErrorOnMissing: true,
                    force: true,
                },
            ],
        }),
        new CleanWebpackPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    ...devServer(development),
});
