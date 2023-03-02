import { useConv2d } from "@/components/layers/Conv2d";
import { applyInput, applyOutput } from "@/components/layers/JustTensor";
import { useSequential } from "@/components/Sequential";
import { param } from "@/type/layer";
import { Conv2dSize, Size, Tensor } from "@/type/size";
import { assetFullUrl, assetUrl } from "@/utils/config";
import Head from "next/head";

export default function Home() {
  const input: Tensor<Size> = {
    shape: [32, 1, 28, 28],
  };
  const conv1 = useConv2d([
    param("in_channels", 1),
    param("out_channels", 3),
    param("kernel_size", 5),
    param("stride", undefined),
    param("padding", undefined),
    param("dilation", undefined),
  ]);
  const conv2 = useConv2d([
    param("in_channels", 3),
    param("out_channels", 6),
    param("kernel_size", 3),
    param("stride", undefined),
    param("padding", undefined),
    param("dilation", undefined),
  ]);
  const { renderLayer } = useSequential<Size>([
    applyInput,
    conv1,
    conv2,
    applyOutput,
  ])(input);
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
        {renderLayer()}
      </main>
    </>
  );
}
