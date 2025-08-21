from flask import Flask,request
import subprocess
from datetime import datetime

app = Flask(__name__)

@app.route('/github-webhook',methods=['POST'])
def github_webhook():
    print("Git triggered by webhook at ",datetime.now())
    subprocess.run(['git','pull'],cwd='')
    return 'ok',200 

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=9000)