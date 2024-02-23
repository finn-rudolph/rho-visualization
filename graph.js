export function modularExp(x, y, modulus) {
  let res = 1;
  while (y != 0) {
    if ((y & 1) == 1) res = (res * x) % modulus;
    x = (x * x) % modulus;
    y >>= 1;
  }
  return res;
}

// Generates the functional graph of
//
//                   f : Z/pZ -> Z/pZ
//                   f : x -> x^(2k) + 1
//
// for use with D3. Returns an array of nodes and links, where nodes are just
// identified by a number in 0..p - 1.
export function getFunctionalGraph(p, k) {
  let nodes = Array.from({ length: p }, (_, __) => Object.create({}));
  let links = Array(p);
  for (let i = 0; i < p; ++i) {
    links[i] = { source: nodes[i], target: nodes[modularExp(i, 2 * k, p)] };
  }
  return [nodes, links];
}
