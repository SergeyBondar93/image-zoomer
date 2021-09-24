let image = "";

const getImage = async () => {
  const request = await fetch("./cat.jpg");
  const blob = await request.blob();

  const reader = new FileReader();

  image = await new Promise((res) => {
    reader.onload = function (e) {
      const src = String(e.target?.result);
      res(src);
    };
    reader.readAsDataURL(blob);
  });
};

const popover = document.getElementById("popover");

let size = 1;

function mouseMove(e) {
  const popover = document.getElementById("popover");
  const { offsetX, offsetY, target, clientY, clientX } = e;
  const { width, height } = target.getBoundingClientRect();
  const fromLeft = offsetX / width;
  const fromTop = offsetY / height;
  const percentLeft = Math.ceil(fromLeft * 100);
  const percentTop = Math.ceil(fromTop * 100);
  const { width: popoverWidth, height: popoverHeight } =
    popover.getBoundingClientRect();
  const popoverImg = document.querySelector("#popover img");

  const { width: originalImageWidth, height: originalImageHeight } =
    popoverImg.getBoundingClientRect();

  const offsetOriginalmageLeft = fromLeft * originalImageWidth;
  const offsetOriginalmageTop = fromTop * originalImageHeight;

  const halfPopoverWidth = popoverWidth / 2;
  const halfPopoverHeight = popoverHeight / 2;

  const originalWidthWithoutHalfPopover = originalImageWidth - halfPopoverWidth;
  const originalHeightWithoutHalfPopover =
    originalImageHeight - halfPopoverHeight;

  const offsetLeft =
    offsetOriginalmageLeft < halfPopoverWidth
      ? offsetOriginalmageLeft
      : offsetOriginalmageLeft > originalWidthWithoutHalfPopover
      ? halfPopoverWidth +
        -(originalWidthWithoutHalfPopover - offsetOriginalmageLeft)
      : halfPopoverWidth;
  const offsetTop =
    offsetOriginalmageTop < halfPopoverHeight
      ? offsetOriginalmageTop
      : offsetOriginalmageTop > originalHeightWithoutHalfPopover
      ? halfPopoverHeight +
        -(originalHeightWithoutHalfPopover - offsetOriginalmageTop)
      : halfPopoverHeight;

  const offsetXforCalc = `-${percentLeft}% + ${offsetLeft}px`;
  const offsetYforCalc = `-${percentTop}% + ${offsetTop}px`;

  popoverImg.style.transform = `translateX(calc(${offsetXforCalc})) translateY(calc(${offsetYforCalc}))`;

  popover.style.position = "absolute";
  popover.style.top = clientY + 20 + "px";
  popover.style.left = clientX - popoverWidth / 2 + "px";
}

function mouseLeave() {
  const popover = document.getElementById("popover");
  size = 1
  popover.remove();
}
function mouseEnter() {
  const popover = document.createElement("div");
  popover.id = "popover";
  const popoverImg = document.createElement("img");
  popoverImg.src = image;

  const sizeElem = document.createElement("span");

  sizeElem.id = "sizeElem";
  sizeElem.style.position = "absolute";
  sizeElem.style.zIndex = "1";
  sizeElem.style.left = "50%";
  sizeElem.style.transform = "translateX(-50%)";
  sizeElem.style.fontSize = "30px";
  sizeElem.style.color = "red";

  sizeElem.innerText = (size * 100).toFixed() + "%";
  popover.append(sizeElem);
  popover.append(popoverImg);
  document.body.append(popover);
}

const CHANGE_PER_SCROLL = 0.15;

function onZoom(e) {
  const popoverImg = document.querySelector("#popover img");
  const popover = document.querySelector("#popover");
  const root = document.querySelector("#root img");
  const changes = e.deltaY < 0 ? 1 + CHANGE_PER_SCROLL : 1 - CHANGE_PER_SCROLL;

  const { width: currentImageWidth } = popoverImg.getBoundingClientRect();
  const { width: popoverWidth } = popover.getBoundingClientRect();
  const newWidth = currentImageWidth * changes;

  if (
    newWidth < root.getBoundingClientRect().width * 1.1 ||
    newWidth < popoverWidth
  )
    return;

  size = size * changes;
  const sizeElem = document.getElementById("sizeElem");
  sizeElem.innerText = (size * 100).toFixed() + "%";
  popoverImg.style.width = newWidth + "px";

  mouseMove(e);
}

const renderImage = async () => {
  await getImage();
  const tag = document.createElement("img");
  tag.src = image;
  tag.width = 300;
  tag.addEventListener("mouseenter", mouseEnter);
  tag.addEventListener("mousemove", mouseMove);
  tag.addEventListener("mouseleave", mouseLeave);

  tag.addEventListener("wheel", onZoom);

  const root = document.getElementById("root");
  root.append(tag);
};
renderImage();
