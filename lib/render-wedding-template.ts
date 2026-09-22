export const TEMPLATE_WIDTH = 1080;
export const TEMPLATE_HEIGHT = 1920;
export const TEMPLATE_FILENAME = "fachrul-tasya-wedding-moment.png";

export type WeddingTemplateData = {
  name: string;
  wishes: string;
  photo: Blob;
};

type DrawableImage = HTMLImageElement;

function loadImage(source: string | Blob): Promise<DrawableImage> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = source instanceof Blob ? URL.createObjectURL(source) : null;
    image.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Template image could not be loaded"));
    };
    image.src = objectUrl ?? (source as string);
  });
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: DrawableImage,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const sourceAspect = image.naturalWidth / image.naturalHeight;
  const targetAspect = width / height;
  let sourceX = 0;
  let sourceY = 0;
  let sourceWidth = image.naturalWidth;
  let sourceHeight = image.naturalHeight;

  if (sourceAspect > targetAspect) {
    sourceWidth = image.naturalHeight * targetAspect;
    sourceX = (image.naturalWidth - sourceWidth) / 2;
  } else {
    sourceHeight = image.naturalWidth / targetAspect;
    sourceY = (image.naturalHeight - sourceHeight) / 2;
  }

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function splitLongWord(context: CanvasRenderingContext2D, word: string, maxWidth: number) {
  const parts: string[] = [];
  let part = "";
  for (const character of word) {
    if (part && context.measureText(part + character).width > maxWidth) {
      parts.push(part);
      part = character;
    } else {
      part += character;
    }
  }
  if (part) parts.push(part);
  return parts;
}

function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  for (const paragraph of text.split(/\r?\n/)) {
    const words = paragraph.trim().split(/\s+/).filter(Boolean).flatMap((word) =>
      context.measureText(word).width > maxWidth ? splitLongWord(context, word, maxWidth) : [word],
    );
    if (!words.length) {
      lines.push("");
      continue;
    }

    let line = words[0];
    for (const word of words.slice(1)) {
      const candidate = `${line} ${word}`;
      if (context.measureText(candidate).width <= maxWidth) line = candidate;
      else {
        lines.push(line);
        line = word;
      }
    }
    lines.push(line);
  }
  return lines;
}

function drawNote(
  context: CanvasRenderingContext2D,
  name: string,
  wishes: string,
  interFont: string,
  patungFont: string,
) {
  const width = 710;
  const height = 390;
  const note = document.createElement("canvas");
  note.width = width;
  note.height = height;
  const noteContext = note.getContext("2d");
  if (!noteContext) throw new Error("Canvas is unavailable");

  noteContext.fillStyle = "#f3f0e9";
  noteContext.fillRect(0, 0, width, height);

  for (let index = 0; index < 750; index += 1) {
    const x = (index * 83) % width;
    const y = (index * 47) % height;
    const alpha = 0.025 + ((index * 13) % 10) / 1000;
    noteContext.fillStyle = `rgba(59, 58, 48, ${alpha})`;
    noteContext.fillRect(x, y, 1.2, 1.2);
  }

  noteContext.strokeStyle = "rgba(49, 65, 45, .22)";
  noteContext.lineWidth = 1;
  for (let y = 124; y <= 356; y += 39) {
    noteContext.beginPath();
    noteContext.moveTo(45, y);
    noteContext.lineTo(width - 38, y);
    noteContext.stroke();
  }

  noteContext.fillStyle = "#263a25";
  noteContext.textBaseline = "alphabetic";
  noteContext.font = `400 31px ${interFont}`;
  noteContext.fillText("From :", 48, 92);

  let nameSize = 47;
  do {
    noteContext.font = `400 ${nameSize}px ${patungFont}`;
    if (noteContext.measureText(name).width <= 490 || nameSize <= 30) break;
    nameSize -= 2;
  } while (nameSize >= 30);
  noteContext.fillText(name, 164, 91);

  let messageSize = 28;
  let messageLines: string[] = [];
  do {
    noteContext.font = `400 ${messageSize}px ${interFont}`;
    messageLines = wrapText(noteContext, wishes, width - 96);
    const lineHeight = messageSize + 9;
    const availableLines = Math.floor((360 - 145) / lineHeight) + 1;
    if (messageLines.length <= availableLines || messageSize <= 22) break;
    messageSize -= 1;
  } while (messageSize >= 22);

  const lineHeight = messageSize + 9;
  noteContext.font = `400 ${messageSize}px ${interFont}`;
  const availableLines = Math.floor((360 - 145) / lineHeight) + 1;
  messageLines.slice(0, availableLines).forEach((line, index) => {
    noteContext.fillText(line, 48, 145 + index * lineHeight, width - 96);
  });

  context.save();
  context.translate(690, 1605);
  context.rotate((-4 * Math.PI) / 180);
  context.shadowColor = "rgba(0, 0, 0, .14)";
  context.shadowBlur = 11;
  context.shadowOffsetY = 7;
  context.drawImage(note, -width / 2, -height / 2, width, height);
  context.restore();
}

function canvasToPng(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG generation failed"));
    }, "image/png");
  });
}

export async function renderWeddingTemplate(data: WeddingTemplateData): Promise<Blob> {
  await document.fonts.ready;
  const rootStyles = getComputedStyle(document.documentElement);
  const interFont = rootStyles.getPropertyValue("--font-inter-tight").trim() || '"Inter Tight", sans-serif';
  const patungFont = rootStyles.getPropertyValue("--font-patung").trim() || "cursive";

  const [background, frame, wax, photo] = await Promise.all([
    loadImage("/images/hasil-bg.png"),
    loadImage("/images/Frame-stamp.png"),
    loadImage("/images/wax.png"),
    loadImage(data.photo),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = TEMPLATE_WIDTH;
  canvas.height = TEMPLATE_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  context.drawImage(background, 0, 0, TEMPLATE_WIDTH, TEMPLATE_HEIGHT);
  context.fillStyle = "rgba(255, 255, 255, .94)";
  context.strokeStyle = "rgba(255, 255, 255, .72)";
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(64, 143);
  context.lineTo(336, 143);
  context.moveTo(814, 143);
  context.lineTo(1080, 143);
  context.stroke();

  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `400 25px ${interFont}`;
  context.letterSpacing = "9px";
  context.fillText("THE WEDDING OF", 540, 143);
  context.letterSpacing = "0px";
  context.font = `400 88px ${patungFont}`;
  context.fillText("Fachrul & Tasya", 540, 248);

  const frameWidth = 950;
  const frameHeight = frameWidth * (1194 / 885);
  context.save();
  context.translate(540, 1006);
  context.rotate((1.6 * Math.PI) / 180);
  context.drawImage(frame, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight);
  drawImageCover(context, photo, -416, -575, 832, 1120);
  context.fillStyle = "#273c25";
  context.textAlign = "center";
  context.font = `450 27px ${interFont}`;
  context.letterSpacing = "6px";
  context.fillText("SABTU  •  03  •  10  •  2026", 0, -528);
  context.restore();

  drawNote(context, data.name, data.wishes, interFont, patungFont);

  context.save();
  context.translate(720, 1390);
  context.rotate((-2 * Math.PI) / 180);
  context.drawImage(wax, -88, -78, 176, 155);
  context.restore();

  return canvasToPng(canvas);
}

export function downloadTemplate(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = TEMPLATE_FILENAME;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
