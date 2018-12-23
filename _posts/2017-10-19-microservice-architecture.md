---
layout:         post
title:          Microservice architecture
date:           2017-10-19 19:00:00 +1
image:          microservices.png
image-alt:      microservices
tags:           [nodejs, npm, nvm, microservices]
categories:     [guide]
---

Thinking about microservice architecture

<!-- more -->

1. TOC
{:toc}

## TODO

## Sources
- Choregraphy & orchestration

> [https://thenewstack.io/ten-commandments-microservices/](https://thenewstack.io/ten-commandments-microservices/)  
> [https://www.infoq.com/articles/microservice-event-choreographies](https://www.infoq.com/articles/microservice-event-choreographies)  
> [https://blog.bernd-ruecker.com/why-service-collaboration-needs-choreography-and-orchestration-239c4f9700fa](https://blog.bernd-ruecker.com/why-service-collaboration-needs-choreography-and-orchestration-239c4f9700fa)  
> [https://blog.bernd-ruecker.com/flowing-retail-demonstrating-aspects-of-microservices-events-and-their-flow-with-concrete-source-7f3abdd40e53](https://blog.bernd-ruecker.com/flowing-retail-demonstrating-aspects-of-microservices-events-and-their-flow-with-concrete-source-7f3abdd40e53)  
> [https://blog.bernd-ruecker.com/how-to-implement-long-running-flows-sagas-business-processes-or-similar-3c870a1b95a8](https://blog.bernd-ruecker.com/how-to-implement-long-running-flows-sagas-business-processes-or-similar-3c870a1b95a8)  
> [https://blog.bernd-ruecker.com/what-are-long-running-processes-b3ee769f0a27](https://blog.bernd-ruecker.com/what-are-long-running-processes-b3ee769f0a27)
> [http://ookami86.github.io/event-sourcing-in-practice/#title.md](http://ookami86.github.io/event-sourcing-in-practice/#title.md)  
> [https://initiate.andela.com/event-sourcing-and-cqrs-a-look-at-kafka-e0c1b90d17d8](https://initiate.andela.com/event-sourcing-and-cqrs-a-look-at-kafka-e0c1b90d17d8)  

## Global architecture layout
- Band service (adding bands, events)
- Crawl service (retrieve events)
- Geocoder service (get lat/lon from location)
- Saga handler (~ state engine)
- EventStoreService (redux)

- DB scripting :
  - write storage : SQLite
  - read storage : ES

- Flow :
  - Add band => SQLite
  - add bandEvent => SQLite
  - get geoloc
  - set geoloc => SQLite
  - insert read/query endpoint (CQRS) => ES

> [https://martinfowler.com/eaaDev/EventSourcing.html](https://martinfowler.com/eaaDev/EventSourcing.html)  
=> selection logic (~ saga processor within event itself ???) => redux

> [http://ookami86.github.io/event-sourcing-in-practice/#title.md](http://ookami86.github.io/event-sourcing-in-practice/#title.md)  
> [https://initiate.andela.com/event-sourcing-and-cqrs-a-look-at-kafka-e0c1b90d17d8](https://initiate.andela.com/event-sourcing-and-cqrs-a-look-at-kafka-e0c1b90d17d8)  

&nbsp;  
Graphic logo from [smartbear.com/solutions/](https://smartbear.com/solutions/)
