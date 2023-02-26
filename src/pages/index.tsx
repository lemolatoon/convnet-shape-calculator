import { Conv2d } from "@/components/layers/Conv2d";
import { Input, Output } from "@/components/layers/JustTensor";
import { Conv2dSize, Tensor } from "@/type/size";
import Head from "next/head";

export default function Home() {
  const input = {
    shape: [32, 1, 28, 28],
  } satisfies Tensor<Conv2dSize>;
  const { layer: inputElm, tensor: tensor1 } = Input(input);
  const { layer: conv1, tensor: tensor2 } = Conv2d({
    in_channels: 1,
    out_channels: 3,
    kernel_size: 5,
  })(tensor1);
  const { layer: conv2, tensor: tensor3 } = Conv2d({
    in_channels: 3,
    out_channels: 6,
    kernel_size: 3,
  })(tensor2);
  const { layer: outputElm, tensor: tensor4 } = Output(tensor3);
  return (
    <>
      <Head>
        <title>ConvNet Shape Calculator</title>
        <meta name="description" content="ConvNet Shape Calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>ConvNet Shape Calculator</h1>
        {inputElm}
        {conv1}
        {conv2}
        {outputElm}
      </main>
    </>
  );
}
