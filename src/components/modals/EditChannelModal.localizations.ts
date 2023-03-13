export const localizations = {
  en: {
    title: 'Edit channel',
    delete: 'Delete channel',
    deleteDetail:
      "This channel will be removed from all joined users. You can't restore data once you delete a channel.",
    deleteConfirm: {
      title: 'Confirm',
      message: 'Are you sure you want to delete this channel?',
      no: 'No',
      delete: 'Delete',
    },
    deleteSuccess: {
      title: 'Deleted',
      message: 'This channel has been deleted.',
    },
    deleteError: {
      title: 'Error',
      message: 'Failed to delete channel.',
    },
    name: {title: 'Name', detail: 'Change the name of this channel.'},
    mode: {
      title: 'Mode',
      detail:
        'Change mode supported in this channel. Use camera mode to allow users to share moments taken from camera only.',
      options: [
        {value: 'both', title: 'Both'},
        {value: 'camera', title: 'Camera'},
        {value: 'library', title: 'Library'},
      ],
    },
    ghosting: {
      title: 'Ghosting',
      detail:
        "Change the number of allowed ghosting days. If set to 7 days, users who haven't posted in the last 7 days can't access the channel.",
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
        'Change options for spam. If set to 6 hours, users can post only once every 6 hours.',
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
      title: 'Notification',
      detail: 'Change the time to send a notification as a reminder.',
      options: [
        {value: 'off', title: 'Off'},
        {value: '6', title: '6 AM'},
        {value: '9', title: '9 AM'},
        {value: '12', title: '12 PM'},
        {value: '15', title: '15 PM'},
        {value: '18', title: '18 PM'},
        {value: '11', title: '21 PM'},
      ],
    },
  },
  ko: {
    title: '채널 수정',
    delete: '채널 삭제',
    deleteDetail:
      '참여한 모든 유저들로부터 이 채널이 삭제됩니다. 삭제 후에는 복원할 수 없습니다.',
    deleteConfirm: {
      title: '확인해주세요',
      message: '이 채널을 정말로 삭제할까요?',
      no: '아니요',
      delete: '삭제하기',
    },
    deleteSuccess: {
      title: '삭제 완료',
      message: '이 채널이 삭제되었습니다.',
    },
    deleteError: {
      title: '에러',
      message: '채널 삭제에 실패했습니다.',
    },
    name: {title: '이름', detail: '채널의 이름을 수정하세요.'},
    mode: {
      title: '모드',
      detail:
        '지원 모드를 변경하세요. 카메라 모드를 선택하면 카메라로 바로 찍은 라이브 모멘트만 올릴 수 있습니다.',
      options: [
        {value: 'both', title: '모두'},
        {value: 'camera', title: '카메라'},
        {value: 'library', title: '라이브러리'},
      ],
    },
    ghosting: {
      title: '눈팅 방지',
      detail:
        '눈팅 가능한 날짜를 변경하세요. 7일을 선택하면, 지난 7일 동안 한 번도 채널에 참여하지 않은 유저들은 채널 내용을 볼 수 없습니다.',
      options: [
        {value: 'off', title: '끄기'},
        {value: '1', title: '1일'},
        {value: '7', title: '7일'},
        {value: '14', title: '14일'},
      ],
    },
    spam: {
      title: '도배',
      detail:
        '도배 관련 옵션을 변경하세요. 6시간으로 설정시, 6시간에 한 번만 공유할 수 있습니다.',
      options: [
        {value: 'off', title: 'Off'},
        {value: '1', title: '1 시간'},
        {value: '3', title: '3 시간'},
        {value: '6', title: '6 시간'},
        {value: '12', title: '12 시간'},
        {value: '24', title: '24 시간'},
      ],
    },
    notificationHours: {
      title: '알림',
      detail: '하루에 한 번 노티가 가는 시간을 변경하세요.',
      options: [
        {value: 'off', title: '끄기'},
        {value: '6', title: '6시'},
        {value: '9', title: '9시'},
        {value: '12', title: '12시'},
        {value: '15', title: '15시'},
        {value: '18', title: '18시'},
        {value: '11', title: '21시'},
      ],
    },
  },
};
