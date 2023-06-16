import { Sequential } from "@/components/Sequential";
import { Layer } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { assetFullUrl, assetUrl } from "@/utils/config";
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
          initLayers={[inputLayer, sequentialLayer, outputLayer]}
          inputTensor={input}
        />
      </main>
    </>
  );
}
