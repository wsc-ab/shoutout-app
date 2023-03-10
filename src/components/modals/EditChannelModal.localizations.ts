export const localizations = {
  en: {
    title: 'Edit channel',
    delete: 'Delete channel',
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
        {name: 'both', title: 'Both'},
        {name: 'camera', title: 'Camera'},
        {name: 'library', title: 'Library'},
      ],
    },
    ghosting: {
      title: 'Block ghosting',
      detail:
        "Change the number of allowed ghosting days. If set to 7 days, users who haven't posted in the last 7 days can't access the channel.",
      options: [
        {name: 'off', title: 'Off'},
        {name: '1', title: '1 Day'},
        {name: '7', title: '7 Days'},
        {name: '14', title: '14 Days'},
      ],
    },
  },
  ko: {
    title: '채널 수정',
    delete: '채널 삭제',
    deleteSuccess: {
      title: '삭제 완료',
      message: '이 채널은 삭제되었습니다.',
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
        {name: 'both', title: '모두'},
        {name: 'camera', title: '카메라'},
        {name: 'library', title: '라이브러리'},
      ],
    },
    ghosting: {
      title: '눈팅 방지',
      detail:
        '눈팅 가능한 날짜를 변경하세요. 7일을 선택하면, 지난 7일 동안 한 번도 채널에 참여하지 않은 유저들은 채널 내용을 볼 수 없습니다.',
      options: [
        {name: 'off', title: '끄기'},
        {name: '1', title: '1일'},
        {name: '7', title: '7일'},
        {name: '14', title: '14일'},
      ],
    },
  },
};
