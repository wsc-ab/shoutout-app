import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Contents from './Contents';

import AuthUserContext from '../../contexts/AuthUser';
import {TObject} from '../../types/Firebase';
import {getSecondsGap} from '../../utils/Date';
import DefaultText from '../defaults/DefaultText';
import Header from './Header';
import Welcome from './Welcome';

const Home = () => {
  const {authUser, authUserData, loaded} = useContext(AuthUserContext);

  const [content, setContent] = useState<TObject>();

  useEffect(() => {
    setContent(authUserData?.contributeTo?.contents?.items?.[0] ?? undefined);
  }, [authUserData?.contributeTo?.contents?.items]);

  const nextSubmitDate = new Date();

  nextSubmitDate.setDate(nextSubmitDate.getDate() + 1);
  nextSubmitDate.setHours(8, 59, 59, 999);

  const isSubmitted = content?.createdAt
    ? getSecondsGap({
        date: nextSubmitDate,
        timestamp: content.createdAt,
      }) > 0
    : false;

  if (!loaded) {
    return null;
  }

  if (!authUser) {
    return <Welcome style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Header />
      {isSubmitted && <Contents style={styles.contents} />}
      {!isSubmitted && (
        <View style={styles.upload}>
          <DefaultText
            title="Please upload a content to view other contents."
            textStyle={{fontWeight: 'bold'}}
          />
          <DefaultText
            title="Share something funny, informative, engaging or anything that made your day!"
            style={{marginTop: 5}}
          />
          <DefaultText
            title="How Shoutout works"
            style={{marginTop: 20}}
            textStyle={{fontWeight: 'bold'}}
          />
          <DefaultText
            title="1. Everyone can upload only one content per day."
            style={{marginTop: 5}}
          />
          <DefaultText
            title="2. We only show contents. No user ID, # of followers, # of shoutouts."
            style={{marginTop: 5}}
          />
          <DefaultText
            title="3. People shoutout to contents, not users."
            style={{marginTop: 5}}
          />
          <DefaultText
            title="4. If a content receives enough shoutouts, it will be in the ranking. Only then we share who shared that content."
            style={{marginTop: 5}}
          />
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {padding: 20, flex: 1},
  contents: {flex: 1},
  upload: {flex: 1, justifyContent: 'center'},
});
