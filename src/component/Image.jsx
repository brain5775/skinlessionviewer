import { Buffer } from "buffer";
import axios from "axios";
import { useState, useEffect } from "react";

const Image = (props) => {
  const [image, setImage] = useState();
  const [Loading, setLoading] = useState(true);

  const url = props.url;
  const contentType = props.contentType;
  const getImage = async () => {
    try {
      const response = await axios.get(`${url}`, {
        headers: {
          Authorization: `Bearer randToken`,
          Accept: "*/*",
        },
        responseType: "arraybuffer",
      });
      const imgURL =
        `data:image/${contentType};base64, ` +
        Buffer.from(response.data, "binary").toString("base64");
      setImage(imgURL);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  if (Loading) {
    return <div>Loading...</div>;
  }

  return <img src={image} alt="" className="w-full h-full" />;
};

export default Image;
