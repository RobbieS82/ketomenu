from application import create_app

app = create_app()

'''
When deployed on PythonAnywhere.com these lines need to be commented out!
'''
if __name__ == '__main__':
   app.run(host="localhost",port="5012",debug=True)
