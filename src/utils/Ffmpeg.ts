import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';

const getFilePathWithoutExt = (input: string) =>
  input.substring(0, input.lastIndexOf('.') + 1);

export const encodeToH264 = async ({input}: {input: string}) => {
  const path = getFilePathWithoutExt(input);
  const output = `${path}.h264`;

  const command = `-y -i ${input} -vcodec libx264 -crf 28 -acodec aac -filter:v fps=30 -preset ultrafast -movflags faststart ${output}`;

  const session = await FFmpegKit.execute(command);

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    return output;
  } else {
    throw new Error('error');
  }
};

export const generateThumb = async ({input}: {input: string}) => {
  const path = getFilePathWithoutExt(input);
  const output = `${path}.jpeg`;

  const command = `-y -i ${input} -vframes 1 -an ${output}`;
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
