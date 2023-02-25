import DefaultAlert from '../components/defaults/DefaultAlert';

export const onUploading = () => {
  DefaultAlert({
    title: 'Please wait',
    message: 'We are uploading your previous moment.',
  });
};
