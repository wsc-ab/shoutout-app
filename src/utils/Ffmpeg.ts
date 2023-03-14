import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

export const encodeToH264 = async ({input}: {input: string}) => {
  const output = `${input}.mp4`;

  const command = `-y -i ${input} -ss 0 -t 60 -vcodec libx264 -crf 28 -acodec aac -filter:v fps=30 -movflags faststart -loglevel quiet ${output}`;

  const session = await FFmpegKit.execute(command);

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    return output;
  } else {
    throw new Error('error');
  }
};

export const generateThumb = async ({input}: {input: string}) => {
  const output = `${input}.jpeg`;

  const command = `-y -i ${input} -vframes 1 -an -loglevel quiet ${output}`;
  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    return output;
  } else if (ReturnCode.isCancel(returnCode)) {
    throw new Error('encode canceled');
  } else {
    throw new Error('encode error');
  }
};

export const encodeImage = async ({input}: {input: string}) => {
  const output = `${input}_1080x1920.jpeg`;

  const command = `-y -i ${input} -filter:v scale=1080:1920:force_original_aspect_ratio=decrease ${output}`;
  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    return output;
  } else if (ReturnCode.isCancel(returnCode)) {
    throw new Error('encode canceled');
  } else {
    throw new Error('encode error');
  }
};

export const resizeImage = async ({input}: {input: string}) => {
  const output = `${input}_200x200.jpeg`;

  const command = `-y -i ${input} -filter:v scale=200:200:force_original_aspect_ratio=decrease ${output}`;
  const session = await FFmpegKit.execute(command);
  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    return output;
  } else if (ReturnCode.isCancel(returnCode)) {
    throw new Error('encode canceled');
  } else {
    throw new Error('encode error');
  }
};
