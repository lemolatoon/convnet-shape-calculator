import { useConv2d } from "@/components/layers/Conv2d";
import { applyInput, applyOutput } from "@/components/layers/JustTensor";
import { useSequential } from "@/components/Sequential";
import { Conv2dSize, Tensor } from "@/type/size";
import { assetFullUrl, assetUrl } from "@/utils/config";
import Head from "next/head";
import { useMemo } from "react";

export default function Home() {
  const input: Tensor<Conv2dSize> = {
    shape: [32, 1, 28, 28],
  };
  const { layer: layer } = useSequential([
    applyInput<Conv2dSize>,
    useConv2d(
      useMemo(() => ({ in_channels: 1, out_channels: 3, kernel_size: 5 }), [])
    ),
    useConv2d(
      useMemo(() => ({ in_channels: 3, out_channels: 3, kernel_size: 3 }), [])
    ),
    applyOutput<Conv2dSize>,
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
        {layer}
      </main>
    </>
  );
}
