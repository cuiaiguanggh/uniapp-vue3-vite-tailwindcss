<template>
  <Question />
</template>

<script setup lang="ts">
import { computed, reactive, ref, toRef, watchEffect } from 'vue'
import Question from './Question.vue'

const questionIndex = ref(0)

const questions = reactive([
  {
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
    answer: [1],
    userAnswer: []
  }
])

// const question = reactive(questions[questionIndex.value])
const question = computed(() => questions[questionIndex.value])
console.log('question: ', question)

watchEffect(() => {
  console.log('watch question: ', question)
  // console.log('questionIndex.value: ', questionIndex.value)
})

const viewMode = ref(0)
const userAnswer = ref<number[]>([])
const answerRef = ref<number[]>([1, 2])

const click = (id) => {
  console.log('click: ', id)
  if (question.value.stem.type === '单选') {
    userAnswer.value = [id]
    return
  }
  if (!userAnswer.value.includes(id)) {
    userAnswer.value.push(id)
  } else {
    userAnswer.value.splice(userAnswer.value.indexOf(id), 1)
  }
}
const next = () => {
  if (questionIndex.value < questions.length) {
    questionIndex.value++
  }
}
</script>

<style lang="scss" scoped>
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
