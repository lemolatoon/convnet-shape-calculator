import {
  normalizeConv2dParams,
  normalizeMaxPool2dParams,
} from "@/components/layers/sizeFuncs";
import { Sequential } from "@/components/Sequential";
import { normalizeSequentialParams } from "@/hooks/useSequential";
import { Layer, param } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { assetFullUrl, assetUrl } from "@/utils/config";
import { clone } from "@/utils/layer";
import Head from "next/head";

export default function Home() {
  const input: Tensor<Size> = {
    shape: [32, 1, 28, 28],
  };
  const inputLayer: Layer = {
    key: "JustTensor",
    params: { name: "Input" },
    noDelete: true,
    noDuplicate: true,
  };
  const outputLayer: Layer = {
    key: "JustTensor",
    params: { name: "Output" },
    noDelete: true,
    noDuplicate: true,
  };
  const conv1: Layer = {
    key: "Conv2d",
    params: normalizeConv2dParams([
      param("in_channels", 1),
      param("out_channels", 3),
      param("kernel_size", 5),
      param("stride", undefined),
      param("padding", undefined),
      param("dilation", undefined),
    ]),
  };
  const pool1: Layer = {
    key: "MaxPool2d",
    params: normalizeMaxPool2dParams([
      param("kernel_size", 3),
      param("stride", undefined),
      param("padding", undefined),
      param("dilation", undefined),
    ]),
  };
  const pool2: Layer = {
    key: "MaxPool2d",
    params: normalizeMaxPool2dParams([
      param("kernel_size", 3),
      param("stride", undefined),
      param("padding", undefined),
      param("dilation", undefined),
    ]),
  };
  const conv2: Layer = {
    key: "Conv2d",
    params: normalizeConv2dParams([
      param("in_channels", 3),
      param("out_channels", 6),
      param("kernel_size", 3),
      param("stride", undefined),
      param("padding", undefined),
      param("dilation", undefined),
    ]),
  };
  const sequentialLayer: Layer = {
    key: "Sequential",
    params: normalizeSequentialParams([conv1, pool1, conv2, pool2]),
  };
  return (
    <>
      <Head>
        <title>ConvNet Shape Calculator</title>
        <meta name="description" content="ConvNet Shape Calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={assetUrl("/favicon.ico")} />
        <meta property="og:image" content={assetFullUrl("/conv.png")} />
        <meta property="og:title" content="ConvNet Shape Calculator" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lemolatoon1" />
        <meta name="twitter:title" content="ConvNet Shape Calculator" />
        <meta
          name="twitter:description"
          content="Interactively calculate Convolution Network shapes"
        />
        <meta property="twitter:image" content={assetFullUrl("/conv.png")} />
      </Head>
      <main>
        <h1>ConvNet Shape Calculator</h1>
        <Sequential
          initLayers={[
            inputLayer,
            clone(sequentialLayer),
            sequentialLayer,
            outputLayer,
          ]}
          inputTensor={input}
        />
      </main>
    </>
  );
}
