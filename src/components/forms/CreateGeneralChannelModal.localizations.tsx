export const localizations = {
  en: {
    title: 'Channel',
    name: {title: 'Name', detail: 'Name of your channel.'},
    detail: {title: 'Detail', detail: 'Purpose of this channel.'},
    type: {
      title: 'Type',
      detail: 'Set it to prvite to not show moments on discovery.',
      options: [
        {value: 'public', title: 'Public'},
        {value: 'private', title: 'Private'},
      ],
    },
    anonymous: {
      title: 'Anonymous',
      detail:
        "If turned on all user IDs will be hidden. It can't be changed once a channel has been created.",
      options: [
        {value: 'off', title: 'Off'},
        {value: 'on', title: 'On'},
      ],
    },
    mode: {
      title: 'Mode',
      detail:
        'Use camera mode to allow users to share moments taken from camera only.',
      options: [
        {value: 'both', title: 'Both'},
        {value: 'camera', title: 'Camera'},
        {value: 'library', title: 'Library'},
      ],
    },
    ghosting: {
      title: 'Ghosting',
      detail:
        "Set the number of allowed ghosting days. If set to 7 days, users who haven't posted in the last 7 days can't access the channel.",
      options: [
        {value: 'off', title: 'Off'},
        {value: '1', title: '1 Day'},
        {value: '7', title: '7 Days'},
        {value: '14', title: '14 Days'},
      ],
    },
    spam: {
      title: 'Spam',
      detail:
        'Set options for spam. If set to 6 hours, users can post only once every 6 hours.',
      options: [
        {value: 'off', title: 'Off'},
        {value: '1', title: '1 hour'},
        {value: '3', title: '3 hour'},
        {value: '6', title: '6 hour'},
        {value: '12', title: '12 hours'},
        {value: '24', title: '24 hours'},
      ],
    },
    notificationHours: {
      title: 'Notification hours',
      detail: 'Select a time to send a notification as a reminder.',
      options: [
        {value: 'off', title: 'Off'},
        {value: 6, title: '6 AM'},
        {value: 9, title: '9 AM'},
        {value: 12, title: '12 PM'},
        {value: 15, title: '15 PM'},
        {value: 18, title: '18 PM'},
        {value: 11, title: '21 PM'},
      ],
    },
  },
  ko: {
    title: '채널',
    name: {title: '이름', detail: '채널의 이름을 적어주세요.'},
    detail: {title: '세부사항', detail: '이 채널의 목적을 적어주세요.'},
    type: {
      title: '종류',
      detail:
        '비공개 채널은 디스커버리 탭이나 검색에서 모멘트를 보여주지 않습니다.',
      options: [
        {value: 'public', title: '공개'},
        {value: 'private', title: '비공개'},
      ],
    },
    anonymous: {
      title: '익명',
      detail:
        '익명 모드 사용시 모든 유저 아이디가 보이지 않습니다. 채널 생성 후 수정할 수 없습니다.',
      options: [
        {value: 'off', title: '끄기'},
        {value: 'on', title: '켜기'},
      ],
    },
    mode: {
      title: '모드',
      detail:
        '카메라 모드를 선택하면 카메라로 바로 찍은 라이브 모멘트만 올릴 수 있습니다.',
      options: [
        {value: 'both', title: '모두'},
        {value: 'camera', title: '카메라'},
        {value: 'library', title: '라이브러리'},
      ],
    },
    ghosting: {
      title: '눈팅',
      detail:
        '눈팅 가능한 날짜를 선택하세요. 7일을 선택하면, 지난 7일 동안 채널에 참여하지 않은 유저들은 채널 내용을 볼 수 없습니다.',
      options: [
        {value: 'off', title: '끄기'},
        {value: '1', title: '1 일'},
        {value: '7', title: '7 일'},
        {value: '14', title: '14 일'},
      ],
    },
    spam: {
      title: '도배',
      detail:
        '도배 관련 옵션을 설정하세요. 6시간으로 설정시, 6시간에 한 번만 공유할 수 있습니다.',
      options: [
        {value: 'off', title: '끄기'},
        {value: '1', title: '1 시간'},
        {value: '3', title: '3 시간'},
        {value: '6', title: '6 시간'},
        {value: '12', title: '12 시간'},
        {value: '24', title: '24 시간'},
      ],
    },
    notificationHours: {
      title: '노티 시간',
      detail: '하루에 한 번 노티가 가는 시간을 선택하세요.',
      options: [
        {value: 'off', title: '끄기'},
        {value: 6, title: '6시'},
        {value: 9, title: '9시'},
        {value: 12, title: '12시'},
        {value: 15, title: '15시'},
        {value: 18, title: '18시'},
        {value: 11, title: '21시'},
      ],
    },
  },
};
