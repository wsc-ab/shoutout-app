import {Alert, AlertButton, AlertOptions} from 'react-native';

type TProps = {title: string; message?: string; buttons?: AlertButton[]};

const DefaultAlert = ({title, message, buttons}: TProps) => {
  const options: AlertOptions = {userInterfaceStyle: 'dark'};
  return Alert.alert(title, message, buttons, options);
};

export default DefaultAlert;
