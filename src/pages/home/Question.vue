<template>
  <view class="top-bar">
    <view>
      {{ qs.current + 1 }}

      <text class="count">/{{ qs.questions.length }}题</text>
    </view>
    <view>
      <u-count-down
        :time="5 * 1000"
        :autoStart="true"
        ref="countDown"
        @change="onChange"
        @finish="onTimeFinish">
        <view class="time">
          <text class="time__item">倒计时：{{ timeData.seconds }}</text>
        </view>
      </u-count-down>
    </view>

    <view>
      <text class="time__item">{{ allScore }}分</text>
    </view>
  </view>
  <view class="container">
    <view class="question-stem">
      <text class="question-t">
        {{ question.stem.type }}
      </text>
      <text class="question-content">
        {{ question.stem.content }}
        {{ questionIndex }}
      </text>
    </view>
    <view class="answer select-group">
      <view
        v-for="{ sign, id, content } in question.options"
        :class="getClass(id)"
        class="select-item"
        @click="click(id)">
        {{ sign + '.' + content }}
      </view>
    </view>

    <view>
      <button
        v-if="viewMode === 0"
        type="primary"
        :disabled="!question.userAnswer.length"
        @click="onConfirmThisQuestion">
        确认答案
      </button>

      <view v-else>
        <button
          v-if="qs.current >= qs.questions.length - 1"
          type="primary"
          :disabled="!question.userAnswer.length"
          @click="commit">
          提交练习
        </button>
        <button v-else type="primary" @click="next">下一题</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
  toRef,
  watchEffect,
  onMounted,
  unref
} from 'vue'
import lodash from 'lodash'
const questionIndex = ref(0)
const timeData = ref({
  seconds: 2
})

const onChange = (e) => {
  console.log('onChange e: ', e)
  timeData.value = e
}

function onTimeFinish() {
  return
  wx.showModal({
    title: '时间到',
    content: '下一题',
    showCancel: false,
    success(res) {
      if (res.confirm) {
        console.log('用户点击确定')
        next()
        calScoreHandle()
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}

const qs = reactive({
  questions: [
    {
      score: 10,
      stem: {
        type: '单选',
        content: `党的各级领导干部要具有共产主义远大理想和中国特色社会主义坚定信念，坚决执行党的基本路线和各项方针、政策，立志改革开放，献身现代化事业，在社会主义建设中艰苦创业，树立正确（），做出经
        得起实践、人民、历史检验的实绩。`
      },
      options: [
        {
          sign: 'A',
          id: 1,
          content: '世界观'
        },
        {
          sign: 'B',
          id: 2,
          content: '历史观'
        },
        {
          sign: 'C',
          id: 3,
          content: '政治观'
        },
        {
          sign: 'D',
          id: 4,
          content: '政绩观'
        }
      ],
      answer: [1],
      userAnswer: []
    },
    {
      score: 10,
      stem: {
        type: '多选',
        content: `企业发展要（）、（）、（），坚持经济效益和社会效益相统一，更好承担起社会责任和道德责任。`
      },
      options: [
        {
          sign: 'A',
          id: 1,
          content: '有原则'
        },
        {
          sign: 'B',
          id: 2,
          content: '有规矩'
        },
        {
          sign: 'C',
          id: 3,
          content: '有信心'
        },
        {
          sign: 'D',
          id: 4,
          content: '有底线'
        }
      ],
      answer: [1, 2],
      userAnswer: []
    }
  ],
  current: 0
})

// const question = reactive(questions[questionIndex.value])
const question = computed(() => qs.questions[qs.current])
console.log('question: ', question)

watchEffect(() => {
  console.log('watch questions: ', qs)
  // console.log('questionIndex.value: ', questionIndex.value)
})

const viewMode = ref(0)
const userAnswer = ref<number[]>([])

const getClass = (id: number) => {
  //作答模式

  const { userAnswer, answer } = question.value
  if (viewMode.value === 0) {
    return userAnswer.includes(id) ? 'select' : ''
  } else {
    if (answer.includes(id)) {
      return 'success'
    } else if (userAnswer.includes(id)) {
      return 'error'
    }
  }
}

const click = (id) => {
  if (viewMode.value === 1) return
  const q = qs.questions[qs.current]
  let _userAnswer: any[] = q.userAnswer
  if (q.stem.type === '单选') {
    _userAnswer = [id]
  } else {
    if (!_userAnswer.includes(id)) {
      _userAnswer.push(id)
    } else {
      _userAnswer.splice(_userAnswer.indexOf(id), 1)
    }
  }

  qs.questions[qs.current].userAnswer = _userAnswer as any
}

const countDown = ref<{ reset?: () => void; start?: () => void } | null>(null)

const next = () => {
  if (qs.current < qs.questions.length - 1) {
    qs.current++
    viewMode.value = 0
    console.log('this.$refs.countDown: ', countDown)
    if (!countDown.value?.reset || !countDown.value?.start) return
    countDown.value.reset()
    countDown.value.start()
  }
}

const allScore = ref(0)

function calScoreHandle() {
  const questions = unref(qs.questions)
  let _score = 0

  questions.forEach(({ answer, userAnswer, score }) => {
    if (lodash.isEqual(answer, userAnswer)) {
      _score += score
    }
    console.log('_score: ', _score)
  })
  allScore.value = _score
}
const onConfirmThisQuestion = () => {
  calScoreHandle()
  viewMode.value = 1
}

const commit = () => {
  console.log('commit: ', qs)
}
</script>

<style lang="scss" scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid rgb(214, 215, 217);
}
.question-stem {
  margin-bottom: calc(2 * $space16);

  .question-t {
    padding: 4px;
    border-radius: 4px;
    background-color: $uni-color-error;
    color: $uni-text-color-inverse;
    margin-right: $space4;
  }
  .question-content {
    line-height: 1.8em;
  }
}

.answer {
  margin-bottom: calc(2 * $space16);
}
.select-group {
  .select-item {
    padding: 16px;
    border-radius: 4px;
    background-color: $uni-bg-color-grey;
    &:not(:nth-last-of-type(1)) {
      margin-bottom: 10px;
    }
    &.select {
      border: 1px solid rgb(242, 145, 0);
      background-color: rgba(252, 189, 113, 0.3);
    }
    &.success {
      border: 1px solid rgb(24, 181, 102);
      background-color: rgba(113, 213, 161, 0.3);
    }

    &.error {
      border: 1px solid rgb(250, 53, 52);
      background-color: rgba(250, 182, 182, 0.3);
    }
  }
}
.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}
</style>
