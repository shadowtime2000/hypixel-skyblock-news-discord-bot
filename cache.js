

class Cache {
  constructor(fetchFunction, minutesToLive = 2) {
    this.millesecondsToLive = minutesToLive * 60 * 1000;
    this.fetchFunction = fetchFunction;
    this.cache = null;
    this.getData = this.getData.bind(this);
    this.resetCache = this.resetCache.bind(this);
    this.isCacheExpired = this.isCacheExpired.bind(this);
    this.fetchData = new Date(0);
  }

  isCacheExpired() {
    return (this.fetchData.getTime() + this.millesecondsToLive) < new Date().getTime();
  }

  getData() {
    if (!this.cache || this.isCacheExpired()) {
      return this.fetchFunction().then((data) => {
        this.cache = data;
        this.fetchData = new Date(0);
        return data;
      })
    } else {
      return this.cache;
    }
  }

  resetCache() {
    this.fetchData = new Date(0);
  }
}

module.exports = Cache;
