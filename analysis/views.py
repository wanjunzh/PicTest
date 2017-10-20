import os
import base64
from io import BytesIO
import time
import requests
from PIL import Image
from django.shortcuts import render, redirect
from .analysis import ela, judge


def index(request):
    return render(request, 'index.html')


def analysis(request):
    if request.method == 'POST':
        try:
            imgurl = request.POST.get('imgurl', None)
            imgurl = (imgurl.startswith('http://') or imgurl.startswith('https://')
                      ) and imgurl or 'http://' + imgurl if imgurl else None
            data = {}
            os.makedirs('tmp', exist_ok=True)
            filename = 'tmp/{}'.format(time.time())
            if imgurl:
                r = requests.get(imgurl)
                # fin = BytesIO(r.content)
                with open(filename, 'wb') as fin:
                    fin.write(r.content)
                data['rawimg'] = imgurl
            else:
                fin = request.FILES['file']
                # buf = BytesIO()
                with open(filename, 'wb') as fin2:
                    for chunk in fin.chunks():
                        fin2.write(chunk)
                # data['rawimg'] = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
                data['rawimg'] = 'data:image/png;base64,' + \
                    base64.b64encode(open(filename, 'rb').read()).decode()
            elaimg, data['diff'] = ela(filename)
            result = judge(filename)
            if result is True:
                data['result'] = '图片没有明显的修改痕迹。'
            elif result is False:
                data['result'] = '图片具有明显的修改痕迹。'
            else:
                if data['diff'] < 20:
                    data['result'] = '图片被 {} 处理过，但修改痕迹不明显。'.format(result[1])
                else:
                    data['result'] = '图片被 {} 处理过，具有明显的修改痕迹。'.format(result[1])
            data['elaimg'] = 'data:image/png;base64,' + \
                base64.b64encode(elaimg).decode()
            return render(request, 'report.html', data)
        except:
            return render(request, 'error500.html')
        finally:
            os.path.exists(filename) and os.remove(filename)
    else:
        return redirect('/')
