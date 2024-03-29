import { useRef, useEffect } from "react";

const ImageScaler = (props) => {
  const svg = props.image;
  const svgRef = useRef(null);
  const scaler = props.scaler;
  // console.log(scaler);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "text/html");
    const htmlElement = doc.documentElement;
    const svgElement = htmlElement.querySelector("svg");
    const svgWidth = svgElement.getAttribute("width");
    const svgHeight = svgElement.getAttribute("height");
    const width = 300;
    const height = 300;
    if (svgElement) {
      svgElement.setAttribute("width", width);
      svgElement.setAttribute("height", height);
      svgElement.setAttribute("class", "border-black border-2 my-2");
      const childSVGElement = svgElement.children;
      let trueScale;
      let mainScale;
      const min = Math.min(
        width / scaler.canvasOriginalWidth,
        height / scaler.canvasOriginalHeight
      );
      trueScale = min;
      mainScale = scaler.scale;

      console.log(scaler);
      console.log(trueScale);
      console.log(mainScale);
      for (let i = 0; i < childSVGElement.length; i++) {
        if (i !== 0) {
          for (
            let att,
              j = 0,
              atts = childSVGElement[i].attributes,
              n = atts.length;
            j < n;
            j++
          ) {
            att = atts[j];
            if (att.nodeName === "points") {
              let currNode = att.nodeValue.split(" ");
              const mainNode = [];
              currNode.forEach((node) => {
                let newNode = node.split(",");
                newNode[0] =
                  (parseInt(newNode[0]) + scaler.panX) * trueScale * mainScale;
                newNode[1] =
                  (parseInt(newNode[1]) + scaler.panY) * trueScale * mainScale;
                mainNode.push([newNode[0], newNode[1]]);
              });
              att.nodeValue = mainNode.join(" ");
            }
            if (
              att.nodeName === "width" ||
              att.nodeName === "height" ||
              att.nodeName === "r" ||
              att.nodeName === "rx" ||
              att.nodeName === "ry" ||
              att.nodeName === "stroke-width"
            ) {
              att.nodeValue = parseInt(att.nodeValue) * trueScale * mainScale;
              console.log(att.nodeName + ":" + att.nodeValue);
            }
            if (
              att.nodeName === "x" ||
              att.nodeName === "cx" ||
              att.nodeName === "x1" ||
              att.nodeName === "x2"
            ) {
              console.log(att.nodeName + ":" + att.nodeValue);
              att.nodeValue =
                (parseInt(att.nodeValue) + scaler.panX) * trueScale * mainScale;
              console.log(att.nodeName + ":" + att.nodeValue);
            }
            if (
              att.nodeName === "y" ||
              att.nodeName === "cy" ||
              att.nodeName === "y1" ||
              att.nodeName === "y2"
            ) {
              att.nodeValue =
                (parseInt(att.nodeValue) + scaler.panY) * trueScale * mainScale;
              console.log(att.nodeName + ":" + att.nodeValue);
            }
          }
        }
      }
      const imageElement = svgElement.querySelector("image");
      if (imageElement) {
        const newImageWidth =
          parseInt(scaler.imageOriginalWidth) * trueScale * mainScale;
        const newImageHeight =
          parseInt(scaler.imageOriginalHeight) * trueScale * mainScale;
        const x = parseInt(scaler.panX) * trueScale * mainScale;
        const y = parseInt(scaler.panY) * trueScale * mainScale;

        console.log(
          scaler.imageOriginalWidth,
          scaler.imageOriginalHeight,
          trueScale,
          mainScale
        );
        console.log(newImageWidth, newImageHeight, x, y);
        imageElement.setAttribute("width", newImageWidth);
        imageElement.setAttribute("height", newImageHeight);
        imageElement.setAttribute("x", x);
        imageElement.setAttribute("y", y);
      }
    }
    svgRef.current.appendChild(htmlElement);
  }, []);
  return <div ref={svgRef}></div>;
};

export default ImageScaler;
