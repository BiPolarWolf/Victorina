from django.http import JsonResponse
from django.shortcuts import render
from questions.models import Answer, Question
from .models import Quiz 
from django.views.generic import ListView
from results.models import Result


class QuizListView(ListView):
    model = Quiz
    template_name = 'quizes/main.html'


def quiz_view(request, pk):
    quiz = Quiz.objects.get(pk=pk)
    return render(request, 'quizes/quiz.html', {'obj': quiz})

def quiz_data_view(request,pk):
    quiz = Quiz.objects.get(pk=pk)
    questions = []
    for q in quiz.get_questions():
        answers = []
        for a in q.get_answers():
            answers.append(a.text)
        questions.append({str(q): answers})

    return JsonResponse({
        'data': questions,
        'time': quiz.time,
    })


def quiz_save_view(request,pk):
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        data = request.POST
        print(data)
        data_ = dict(data)
        data_.pop('csrfmiddlewaretoken')
        questions = []
        
        for key in data_.keys():
            question = Question.objects.get(text = key)
            questions.append(question)

        user = request.user
        quiz = Quiz.objects.get(pk=pk)
        score = 0
        multiplier = 100 / quiz.number_of_questions
        results = []
        correct_answer = None

        for q in questions:
            a_selected = request.POST.get(q.text)
            print(f'{q.text} - {a_selected}')

            if a_selected != '':
                for a in Answer.objects.filter(question=q):
                    if a_selected == a.text:
                        if a.correct:
                            score +=1
                            correct_answer = a.text
                    else:
                        if a.correct:
                            correct_answer = a.text

                results.append({str(q):{'correct_answer':correct_answer,'answered':a_selected}})
            else:
                results.append({str(q):'not answered'})

        score_ = score * multiplier
        Result.objects.create(quiz=quiz,user=user,score=score_)
        if score_ >= quiz.required_score_to_pass:
            return JsonResponse({'passed':True,'score':score_,'results': results})
        else:
            return JsonResponse({'passed':False,'score':score_,'results': results})