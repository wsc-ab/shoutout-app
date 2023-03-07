import React, {useContext, useEffect, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import AuthUserContext from '../../contexts/AuthUser';
import {createReport, deleteReport} from '../../functions/Moment';
import {TStyleView} from '../../types/Style';
import DefaultAlert from '../defaults/DefaultAlert';
import {defaultRed} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';

type TProps = {
  moment: {id: string; content: {path: string}; createdBy: {id: string}};
  onSuccess?: () => void;
  style?: TStyleView;
};

const ReportButton = ({moment, onSuccess, style}: TProps) => {
  const {authUserData} = useContext(AuthUserContext);
  const {addReportContent, removeReportContent} = useContext(AuthUserContext);

  const onReport = () => {
    const onPress = async () => {
      try {
        setIsReported(true);
        addReportContent(moment.id);
        await createReport({moment});

        onSuccess && onSuccess();
      } catch (error) {
        setIsReported(false);
        removeReportContent(moment.id);
        if ((error as {message: string}).message === "target doesn't exist") {
          DefaultAlert({
            title: 'Deleted moment',
          });
        } else {
          DefaultAlert({
            title: 'Error',
            message: (error as {message: string}).message,
          });
        }
      }
    };

    DefaultAlert({
      title: 'Please confirm',
      message: "Report this moment? We'll no longer show you this moment.",
      buttons: [{text: 'Report', onPress, style: 'destructive'}, {text: 'No'}],
    });
  };

  const onUnreport = async () => {
    try {
      setIsReported(false);
      removeReportContent(moment.id);
      await deleteReport({
        moment,
      });
    } catch (error) {
      setIsReported(true);
      addReportContent(moment.id);
      DefaultAlert({
        title: 'Error',
        message: (error as {message: string}).message,
      });
    }
  };

  const [isReported, setIsReported] = useState(false);

  useEffect(() => {
    setIsReported(
      authUserData.reported.items
        .map(({id}: {id: string}) => id)
        .includes(moment.id),
    );
  }, [authUserData.reported.items, moment.id]);

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={isReported ? onUnreport : onReport}>
      <DefaultIcon
        icon="flag"
        size={20}
        color={isReported ? defaultRed.lv2 : 'white'}
      />
    </Pressable>
  );
};

export default ReportButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
