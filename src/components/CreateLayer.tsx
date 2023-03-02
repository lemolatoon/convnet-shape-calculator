import { renderLayer } from "@/components/ui/Layer";
import { Layer, LayerKey, layerKeys } from "@/type/layer";
import { defaultLayer } from "@/utils/layer";
import { ChangeEventHandler, useMemo, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  background-color: white;
  border-radius: 4px;
  box-shadow: 0px 0px 6px 3px rgba(99, 255, 255, 0.46);
  padding: 1em;
`;

const Select = styled.select`
  font-size: 2em;
`;

const Button = styled.button`
  font-size: 2em;
`;

type CreateLayerProps = {
  addNewLayer: (layer: Layer) => void;
};
export const CreateLayer = ({ addNewLayer }: CreateLayerProps) => {
  const [key, setKey] = useState<LayerKey>("Conv2d");
  const initLayer = useMemo(() => defaultLayer(key), [key]);
  const [layer, setLayer] = useState(initLayer);

  const Layer = renderLayer(layer, setLayer);
  const handleChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (layerKeys.includes(e.target.value as any)) {
      const key = e.target.value as (typeof layerKeys)[number];
      setKey(key);
      setLayer(defaultLayer(key));
    }
  };
  return (
    <Wrapper>
      <Select value={key} onChange={handleChange}>
        {layerKeys.map((key) => (
          <option key={key} value={key}>
            {key}
          </option>
        ))}
      </Select>
      <Layer />
      <Button onClick={() => addNewLayer(layer)}>OK</Button>
    </Wrapper>
  );
};
