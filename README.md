# What

This repo is a demo of how a cashback app would work when you have some services already there.

# Why

A lot of parts are already in play, so this is a proof of concept that it can be done technically and code is not the bottleneck.

# How

The fiscalization system is already in place, so this app leverages calls to that API to confirm that what you bought was accepted (fiscalized) by the state. This app scans a qr code, confirms with the API, and then adds points in the form of the usual cashback style.

For now this demo has 3 accounts that should actually be in 3 separate apps. The administrator - can add or remove companies from the system. Uses a qr code of a receipt to add the company in a fast way (so it calls the API to get public details about the company). The company - can add money to its account or close the account. The customer - can scan the qr code to get points.
