<!--
@Author: mars
@Date:   2017-01-15T18:29:14-05:00
@Last modified by:   mars
@Last modified time: 2017-01-16T00:49:34-05:00
-->

### Exposed methods
* locateByDomain
```javascript
SiteMonitoring.locateByDomain('www.example.com')
.then({ origin, destination } => {
    // origin = { region_code, latitude, longitude }
    // destination = [ { region_code, latitude, longitude } ]
});

```
* locateByAddress
```javascript
SiteMonitoring.locateByAddress('111.111.111.111')
.then({ origin, destination } => {
  // origin = { region_code, latitude, longitude }
  // destination = [ { region_code, latitude, longitude } ]
});
```


```javascript
// node
{
  id: string,
  previous: @id,
  next: @id,
  meta: { ip: string, region_code: string, latitude, longitude }
}
// network
{
  origin: @node,
  vectors: Array<{ origin: @node.id, destination: @node.id }>
}
```

### Using winston
We store all this info in one table as json

```javascript
// node or network
{
  type: enum // NODE, NETWORK
  // node attributes, network attributes
}
```
