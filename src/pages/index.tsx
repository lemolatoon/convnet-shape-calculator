import { Header } from "@/components/Header";
import { Sequential } from "@/components/Sequential";
import { Layer, SequentialLayer, SequentialParams } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { assetFullUrl, assetUrl } from "@/utils/config";
import {
  DeepPartial,
  validateLayer,
} from "@/validation/validation";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const params = router.query["params"];
  let normalizedParams: string | null = null;
  if (typeof params === "string") {
    normalizedParams = params;
  } else if (params != undefined) {
    normalizedParams = params.join(",");
  }
  let initLayer: SequentialLayer | null = null;
  if (normalizedParams) {
    const rawLayer = JSON.parse(normalizedParams) as DeepPartial<Layer>;
    const validated = validateLayer(rawLayer);
    validated.match(
      (layer) => {
        if (layer.key !== "Sequential") {
          console.error(
            `passed query parameter is not Sequential params, but ${layer.key}`
          );
          return;
        }
        initLayer = layer;
      },
      (e) => {
        console.error(`query params, validation error\n${e}`);
      }
    );
  }
  console.log(initLayer);
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
    params: {
      in_channels: 1,
      out_channels: 3,
      kernel_size: 5,
      stride: 1,
      padding: 0,
      dilation: 1,
    },
  };
  const pool1: Layer = {
    key: "MaxPool2d",
    params: {
      kernel_size: 3,
      stride: 3,
      padding: 0,
      dilation: 1,
    },
  };
  const pool2: Layer = {
    key: "MaxPool2d",
    params: {
      kernel_size: 3,
      stride: 3,
      padding: 0,
      dilation: 1,
    },
  };
  const conv2: Layer = {
    key: "Conv2d",
    params: {
      in_channels: 3,
      out_channels: 6,
      kernel_size: 3,
      stride: 1,
      padding: 0,
      dilation: 1,
    },
  };
  const sequentialLayer: Layer = {
    key: "Sequential",
    params: {
      layers: [conv1, pool1, conv2, pool2].map((layer, id) => {
        return { layer, id };
      }),
    },
  };
  const initLayersFallback = [inputLayer, sequentialLayer, outputLayer];
  const initParamsFallback: SequentialLayer = {
    key: "Sequential" as const,
    params: {
      layers: (initLayer ? [initLayer] : initLayersFallback).map(
        (layer, id) => {
          return { layer, id };
        }
      ),
    },
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
        <Header />
        <Sequential
          key={normalizedParams}
          initParams={initLayer ?? initParamsFallback}
          inputTensor={input}
        />
      </main>
    </>
  );
}
