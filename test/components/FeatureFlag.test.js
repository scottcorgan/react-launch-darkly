import React from "react";
import { mount } from "enzyme";
import { Subscriber } from "react-broadcast";

import FeatureFlag from "../../src/components/FeatureFlag";
import FeatureFlagRenderer from "../../src/components/FeatureFlagRenderer";
import LaunchDarkly from "../../src/components/LaunchDarkly";
import { BROADCAST_CHANNEL } from "../../src/constants/LaunchDarkly";

describe("components/FeatureFlag", () => {
  const defaultProps = {
    flagKey: "abc",
    renderFeatureCallback: () => <div>hi!</div>
  };
  const config = {
    clientId: "80808080",
    user: {
      key: "abc123"
    },
    clientOptions: {
      baseUrl: "https://test"
    }
  };

  it("subscribes to the correct broadcast channel", () => {
    const subject = mount(
      <LaunchDarkly clientId={config.clientId} user={config.user}>
        <FeatureFlag {...defaultProps} />
      </LaunchDarkly>
    );

    const subscriber = subject.find(Subscriber);
    expect(subscriber.prop("channel")).toEqual(BROADCAST_CHANNEL);
  });

  it("passes the props to FeatuerFlagRenderer", () => {
    const allProps = {
      ...defaultProps,
      renderDefaultCallback: () => <div>Default</div>,
      initialRenderCallback: () => <div>Initial…</div>
    };

    const subject = mount(
      <LaunchDarkly
        clientId={config.clientId}
        user={config.user}
        clientOptions={config.clientOptions}
      >
        <FeatureFlag {...allProps} />
      </LaunchDarkly>
    );

    const renderer = subject.find(FeatureFlagRenderer);
    expect(renderer.prop("flagKey")).toEqual(allProps.flagKey);
    expect(renderer.prop("renderFeatureCallback")).toEqual(allProps.renderFeatureCallback);
    expect(renderer.prop("renderDefaultCallback")).toEqual(allProps.renderDefaultCallback);
    expect(renderer.prop("initialRenderCallback")).toEqual(allProps.initialRenderCallback);
    expect(renderer.prop("clientId")).toEqual(config.clientId);
    expect(renderer.prop("user")).toEqual(config.user);
    expect(renderer.prop("clientOptions")).toEqual(config.clientOptions);
  });

  describe("when Broadcast sends no value", () => {
    it("does not render the FeatureFlagRenderer component", () => {
      const subject = mount(
        <LaunchDarkly>
          <FeatureFlag {...defaultProps} />
        </LaunchDarkly>
      );
      const renderer = subject.find(FeatureFlagRenderer);
      expect(renderer).toHaveLength(0);
    });
  });
});
