import path from "path";

export default {
  mode: "development", // Set to 'production' for production builds
  entry: "./src/main.tsx", // Ensure the correct path to the entry file
  output: {
    filename: "bundle.js",
    path: path.resolve("dist"), // Output to the 'dist' folder
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"], // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Match .ts or .tsx files
        loader: "ts-loader",
        options: {
          transpileOnly: true, // Only transpile, no type checking
        },
        exclude: /node_modules/, // Exclude node_modules from processing
      },
    ],
  },
};
