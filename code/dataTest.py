import re
from tabulate import tabulate

text = r"""
Thank you, Alison and good morning, everyone. We appreciate you joining us today 
to discuss Fubo's fourth quarter and full-year 2023 results. We are pleased 
to report that Fubo once again exceeded guidance across key financial 
and operating metrics in North America with double-digit year-over-year 
growth during the fourth quarter. We delivered a record 1.62 million paid 
subscribers, an increase of 12% year-over-year and $402 million in total 
revenue, up an impressive 29% year-over-year.

In the context of a challenging year for the advertising 
industry, the accomplishments of our ad sales team is indeed noteworthy. 
Delivering a record $114 million in annual revenue, a 14% increase over the 
prior year, demonstrates remarkable resilience and effectiveness in our strategy 
and execution. Our balance sheet is healthy, reinforcing our confidence in 
achieving our profitability target in 2025. 
"""

dataperc_locs = []
dataval_locs = []

dataperc = []
dataval = []

data = []

pattern = re.compile(r'[-+]?\d*\.\d+|\d+')
matches = pattern.finditer(text)

numbers = re.findall(pattern, text)
print(numbers)

for match in matches:
  if (text[match.span()[1]] == '%'):
    dataperc_locs.append(match.span())
  elif (text[match.span()[1] + 1 : match.span()[1] + 8] == "million"):
    dataval_locs.append(match.span())

for d in dataperc_locs:
   dataperc.append(text[d[0] : d[1]])

for d in dataval_locs:
  dataval.append(text[d[0] : d[1]])

for i in range(len(dataperc)):
  data.append([dataval[i], dataperc[i]])

head = ["Values (millions of dollars)", "Percent increase (%)"]
print(tabulate(data, headers=head, tablefmt="grid"))