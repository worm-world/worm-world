import jStat from 'jstat';

export interface BreedCountProbabilityProps {
  probability?: number;
}

const BreedCountProbability = (
  props: BreedCountProbabilityProps
): React.JSX.Element => {
  const getNForConfidence = (confidence: number): number => {
    if (
      confidence > 0.999 ||
      props.probability === 0 ||
      props.probability === undefined
    ) {
      return -1;
    }
    // Increment number -> for when n will get very large
    const inc = props.probability >= 0.2 ? 1 : 5;
    let n = 0; // worm counter
    let cdf = 1 - jStat.binomial.cdf(0, n, props.probability); // Confidence value for n worms

    // loop until we find what n value gives us our required confidence
    while (cdf < confidence) {
      n += inc;
      cdf = 1 - jStat.binomial.cdf(0, n, props.probability);
    }
    return n;
  };

  return (
    <div>
      <p className='text-xl'>Breed Count</p>
      <p data-testid={'countOne'}>
        {getNForConfidence(0.8)} for 80% Confidence
      </p>
      <progress
        data-testid={'progress-0.8'}
        className='progress-error progress w-56'
        value={0.8}
        max='1'
      ></progress>
      <p data-testid={'countTwo'}>
        {getNForConfidence(0.9)} for 90% Confidence
      </p>
      <progress
        data-testid={'progress-0.9'}
        className='progress-warning progress w-56'
        value={0.9}
        max='1'
      ></progress>
      <p data-testid={'countThree'}>
        {getNForConfidence(0.95)} for 95% Confidence
      </p>
      <progress
        data-testid={'progress-0.95'}
        className='progress-info progress w-56'
        value={0.95}
        max='1'
      ></progress>
      <p data-testid={'countFour'}>
        {getNForConfidence(0.99)} for 99% Confidence
      </p>
      <progress
        data-testid={'progress-0.99'}
        className='progress-success progress w-56'
        value={1}
        max='1'
      ></progress>
    </div>
  );
};

export default BreedCountProbability;
