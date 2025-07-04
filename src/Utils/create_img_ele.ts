export const create_img_ele = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const img_ele = document.createElement("img");
    img_ele.src = src;
    img_ele.onerror = rej;
    img_ele.onabort = () => rej(new Error(create_img_ele.name + " aborted!"));
    img_ele.onload = () => res(img_ele);
  });
