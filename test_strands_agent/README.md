

docker buildx build --platform linux/amd64 --provenance=false -t test-strands-agent:latest .

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 552566233886.dkr.ecr.us-east-1.amazonaws.com

docker tag test-strands-agent:latest 552566233886.dkr.ecr.us-east-1.amazonaws.com/strands-agents:latest

docker push 552566233886.dkr.ecr.us-east-1.amazonaws.com/strands-agents:latest


```
docker run --platform linux/amd64 -p 9000:8080 test-strands-agent:latest
```

```
curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'
```

