import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {TTimestamp} from '../../types/Firebase';
import DefaultBottomModal from '../defaults/DefaultBottomModal';
import {defaultBlack} from '../defaults/DefaultColors';
import DefaultIcon from '../defaults/DefaultIcon';
import DefaultText from '../defaults/DefaultText';
import UserProfileImage from '../images/UserProfileImage';

type TProps = {
  comments: {
    user: {id: string; displayName: string};
    detail: string;
    addedAt: TTimestamp;
  }[];
  onCancel: () => void;
};

const CommentsModal = ({comments, onCancel}: TProps) => (
  <DefaultBottomModal onCancel={onCancel}>
    <View
      style={{
        top: '50%',
        flex: 1,
        backgroundColor: defaultBlack.lv2(1),
        paddingTop: 10,
      }}>
      <ScrollView>
        {comments.map(comment => (
          <View style={{padding: 10, flexDirection: 'row'}}>
            <UserProfileImage
              user={{
                id: comment.user.id,
              }}
            />
            <View style={{marginLeft: 10, flex: 1}}>
              <DefaultText
                title={comment.user.displayName}
                textStyle={{fontWeight: 'bold'}}
                style={{marginBottom: 5, flex: 1}}
              />
              <DefaultText
                title={
                  'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis excepturi nisi, omnis laborum vel officiis consequatur quos vero voluptatem! Vel rem consectetur nostrum esse nobis itaque quod deserunt tenetur unde.'
                }
                textStyle={{}}
              />
              <View
                style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
                <DefaultText title={'asdf'} />
                <DefaultIcon icon="times" style={{padding: 10, flex: 1}} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  </DefaultBottomModal>
);

export default CommentsModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'gray',
    padding: 20,
    flexDirection: 'row',
    // height: 200,
    bottom: 0,
  },
});
