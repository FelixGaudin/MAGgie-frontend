install:
	pip install -r requirements.txt -r requirements.dev.txt

format:
	isort *.py
	black *.py
