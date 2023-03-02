import { useConv2d } from "@/components/layers/Conv2d";
import { applyInput, applyOutput } from "@/components/layers/JustTensor";
import { normalizeConv2dParams } from "@/components/layers/sizeFuncs";
import { useSequential } from "@/components/Sequential";
import { renderLayer } from "@/components/ui/Layer";
import { normalizeSequentialParams } from "@/hooks/useSequential";
import { Layer, param } from "@/type/layer";
import { Conv2dSize, Size, Tensor } from "@/type/size";
import { assetFullUrl, assetUrl } from "@/utils/config";
import Head from "next/head";

export default function Home() {
  const input: Tensor<Size> = {
    shape: [32, 1, 28, 28],
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
  const Sequential: Layer = {
    key: "Sequential",
    params: normalizeSequentialParams([conv1, conv2]),
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
        {renderLayer(conv1, (val) => console.log(val))(input)}
      </main>
    </>
  );
}
