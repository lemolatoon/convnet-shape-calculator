import { normalizeConv2dParams } from "@/components/layers/sizeFuncs";
import { renderLayer } from "@/components/ui/Layer";
import { normalizeSequentialParams } from "@/hooks/useSequential";
import { Layer, param } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { assetFullUrl, assetUrl } from "@/utils/config";
import Head from "next/head";

export default function Home() {
  const input: Tensor<Size> = {
    shape: [32, 1, 28, 28],
  };
  const inputLayer: Layer = {
    key: "JustTensor",
    params: { name: "Input" },
  };
  const outputLayer: Layer = {
    key: "JustTensor",
    params: { name: "Output" },
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
    params: normalizeSequentialParams([inputLayer, conv1, conv2, outputLayer]),
  };
  const Sequential = renderLayer(sequentialLayer, (val) => console.log(val));
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
        <Sequential tensor={input} />
      </main>
    </>
  );
}
